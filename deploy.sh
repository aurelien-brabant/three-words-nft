#! /bin/sh

if [ $# -eq 1 ] &&  [ "$1" == "realmode" ]; then
	echo "Note: will deploy on rinkeby testnet" 1>&2
	network="--network rinkeby"
fi

contract_address=$(npx hardhat run ./scripts/deploy.js $network | tail -1)
cp -f ./artifacts/contracts/MyEpicNFT.sol/MyEpicNFT.json ./frontend/src/utils/MyEpicNFT.json

printf "const contract = \"$contract_address\";\n\nexport default contract;\n" > ./frontend/src/utils/contractAddress.js
