import { useEffect, createContext, useState, useContext } from "react"
import DecentralizedIdentityAbi from "../abi/Decentralized_Identity.json";
import { ethers } from "ethers"
const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const [accountAddr, setAccountAddr] = useState("");
    const [contract, setContract] = useState(null)
    const [provider, setProvider] = useState(null);

    useEffect(() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        console.log(provider);
        const loadProvider = async () => {
            if (provider) {
                window.ethereum.on('chainChanged', () => {
                    window.location.reload();
                })
                window.ethereum.on('accountsChanged', () => {
                    window.location.reload();
                })
                await provider.send('eth_requestAccounts', []);
                const signer = provider.getSigner();
                const address = await signer.getAddress()
                setAccountAddr(address);
                const contract = new ethers.Contract(DecentralizedIdentityAbi.address, DecentralizedIdentityAbi.abi, signer)
                setContract(contract)
                setProvider(provider)
                console.log(contract);
            }
            else {
                alert("Metamask is not Installed!")
            }
        }
        provider && loadProvider()
    }, [])

    return (
        <StateContext.Provider value={{ accountAddr, contract, provider }} >
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);