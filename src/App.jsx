import { utils, getPublicKey, sign, verify, recoverPublicKey } from "ethereum-cryptography/secp256k1.js"
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils.js";
import { keccak256 } from "ethereum-cryptography/keccak";
import SecureLS from 'secure-ls';
import { useStateContext } from "./context/context";
import "./App.css";
import { useState } from "react";

function App() {

  const { accountAddr, contract } = useStateContext();
  const [ setSignature] = useState();
  const [ setMessageHash] = useState();
  const secureLS = new SecureLS({ encodingType: 'aes' });
  console.log(accountAddr);
  let msgHash, recoverBit;

  const generateAndSaveKeyPairs = async (e) => {
    e.preventDefault();
    if (await contract.checkIfRegistered()) {
      console.log("Already Registered");
      alert("You are already Registered!");
    }
    else {
      const privateKey = toHex(utils.randomPrivateKey());
      const publicKey = toHex(getPublicKey(privateKey));
      console.log("Private Key:", privateKey);
      console.log("Public Key:", publicKey);
      let keyPair;
      try {
        secureLS.set('KeyPairs', { privateKey, publicKey });
        console.log("KeyPairs Saved Successfully!");
      }
      catch (err) {
        console.log(err);
      }
      console.log(keyPair);
      const newUser = await contract.RegisterDID(publicKey);
      console.log(newUser);
    }
  }

  const generateSignature = async (e) => {
    e.preventDefault();
    if (await contract.checkIfRegistered()){
      let nonce = 101;
      msgHash = keccak256(utf8ToBytes(JSON.stringify(nonce) + accountAddr));
      setMessageHash(msgHash);
      const keyPair = secureLS.get('KeyPairs');
      const signTxn = await sign(msgHash, keyPair.privateKey, { recovered: true });
      console.log(signTxn);
      const [signature, recoveryBit] = signTxn;
      const formattedSignature = Uint8Array.from(Object.values(signature));
      console.log(formattedSignature);
      setSignature(formattedSignature);
      recoverBit = recoveryBit;
      console.log(signature);
      alert("Your Transaction Signed!");
      const publicKey = await recoverPublicKey(toHex(msgHash), signature, recoverBit);
      const verifiedTxn = verify(signature, msgHash, publicKey);
      console.log(verifiedTxn);
      if (!verifiedTxn) {
        alert("Invalid Identity!");
      }
      else {
        alert("Your Identity has been verified Successfully!");
      }
    }
    else {
      console.log("please Register First");
      alert("Register your Account!!");
    }
  }

  return (
    <>
      <h1>Decentralized-Identity</h1>
      {accountAddr ?
        <div className="card">
          <div className="container">
            <div>
              <h2>
                Generate your DID and Register your DID on Blockchain!?
              </h2>
              <button onClick={generateAndSaveKeyPairs}>Generate and Register your DID</button>
            </div>
            <div>
              <h2>
                Get your Signed Transaction
              </h2>
              <button onClick={generateSignature}>
                Sign and Verify your Identity
              </button>
            </div>
          </div>
        </div>
        :
        <div>
          <h2>
            Login with Metamask First
          </h2>
        </div>
      }
    </>
  )
}

export default App
