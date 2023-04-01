import React, {useEffect, useRef, useState} from "react";
import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Container,
    createTheme,
    CssBaseline,
    ThemeProvider,
    Typography
} from "@mui/material";
import {Contract, ethers} from "ethers";
import {NFT_CONTRACT_ADDRESS} from "./constants"
import abi from "./abi/contractAbi";
import Web3Modal from "web3modal";

const theme = createTheme();

function App() {
    const [walletConnected, setWalletConnected] = useState(false);
    const [nfts, setNfts] = useState(0);
    const [isWaiting, setIsWaiting] = useState(false);
    const web3ModalRef = useRef();

    const getProviderOrSigner = async (needSigner = false) => {
        const provider = await web3ModalRef.current.connect();
        const web3Provider = new ethers.providers.Web3Provider(provider);

        const {chainId} = await web3Provider.getNetwork();
        if (chainId !== 97) {
            window.alert("Change network");
        }
        if (needSigner) {
            const signer = web3Provider.getSigner();
            return signer;
        }
        return web3Provider;
    };

    const safeMint = async () => {
        setIsWaiting(true);
        try {
            const signer = await getProviderOrSigner(true);

            console.log(signer);
            const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);

            const tx = await nftContract.safeMint(signer.getAddress(), {
                value: ethers.utils.parseEther("0.001"),
            });
            await tx.wait();
            await getNFTs();
        } catch (error) {
            console.error(error);
        }
        setIsWaiting(false);
    };

    const getNFTs = async () => {
        try {
            const signer = await getProviderOrSigner(true);
            const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
            const address = await signer.getAddress();
            const nftBalance = Number(await nftContract.balanceOf(address));
            if (nftBalance) {
                setNfts(nftBalance);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const connectWallet = async () => {
        try {
            await getProviderOrSigner();
            setWalletConnected(true);
        } catch (error) {
            console.error(error);
        }
    };

    const renderButton = () => {
        if (walletConnected) {
            return (
                <Box>
                    <Typography variant="h6" component="h6">Your number of nfts: {nfts}</Typography>
                    <Button variant="contained" onClick={safeMint}>
                        Mint
                    </Button>
                </Box>
            );
        } else {
            return (
                <Box>
                    <Typography variant="h6" component="h6">Connect wallet, please!</Typography>
                    <Button variant="contained"
                            onClick={connectWallet}>
                        Connect to Metamask
                    </Button>
                </Box>
            );
        }
    };

    useEffect(() => {
        if (!walletConnected) {
            web3ModalRef.current = new Web3Modal({
                network: 97,
                providerOptions: {},
                disableInjectedProvider: false,
            });
            connectWallet();
            getNFTs();
        }
    }, [walletConnected]);

    return (
        <div className="App">
            <CssBaseline/>
            <ThemeProvider theme={theme}>
                <Container component="main">
                    <Backdrop
                        sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                        open={isWaiting}
                    >
                        <CircularProgress color="inherit"/>
                    </Backdrop>
                    <Box
                        sx={{
                            marginTop: 30,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <img className="logo-app" src={process.env.PUBLIC_URL + '/logo.png'}/>
                        {renderButton()}
                    </Box>
                </Container>
            </ThemeProvider>
        </div>
    );
}

export default App;
