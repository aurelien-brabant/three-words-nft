// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import { Base64 } from "./lib/base64.sol";

import "hardhat/console.sol";

contract MyEpicNFT is ERC721URIStorage {
	using Counters for Counters.Counter;
	Counters.Counter private _tokenIdCounter; // state variable => lies in contract's storage

	// the maximum number of NFTs that will be mintable.
	// Passed this limit, subsequent minting attempts would result in an error.
	uint256 mintCap = 150;

	string[] firstWords = [ "Highly", "Astonishly", "Awesomely", "Surprisingly", "Actually", "Maybe", "Fucking", "Barely", "Absolutely" ];
	string[] secondWords = [ "Despicable", "Frozen", "Hot", "Broken", "Unbalanced", "Biased", "Overrated", "Underrated", "Overpowered" ];
	string[] thirdWords = [ "Escanor", "Sasuke", "Jotaro", "Dio", "Polnareff", "Dio", "Killua", "Hisoka", "Alder" ];

	string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

	event NewEpicNFTMinted(address sender, uint256 tokenId, uint256 mintCap);

	constructor() ERC721 ("SquareNFT", "SQUARE") {
	}

	function getMintedAmount() public view returns (uint256) {
		return _tokenIdCounter.current();
	}

	function getMintCap() public view returns (uint256) {
		return mintCap;
	}

	function pickRandomFirstWord(uint256 tokenId) public view returns (string memory) {
		uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
		rand = rand % firstWords.length;

		return firstWords[rand];
	}

	function pickRandomSecondWord(uint256 tokenId) public view returns (string memory) {
		uint256 rand = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId))));
		rand = rand % secondWords.length;

		return secondWords[rand];
	}

	function pickRandomThirdWord(uint256 tokenId) public view returns (string memory) {
		uint256 rand = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId))));
		rand = rand % thirdWords.length;

		return thirdWords[rand];
	}

	function random(string memory input) internal pure returns (uint256) {
		return uint256(keccak256(abi.encodePacked(input)));
	}

	function makeAnEpicNFT() public {
		uint256 newItemId = _tokenIdCounter.current();

		// if mintCap has been reached, throw an error!
		require(newItemId < mintCap);

		string memory firstWord = pickRandomFirstWord(newItemId);
		string memory secondWord = pickRandomSecondWord(newItemId);
		string memory thirdWord = pickRandomThirdWord(newItemId);
		string memory combinedWord = string(abi.encodePacked(firstWord, secondWord, thirdWord));

		string memory customSvg = string(abi.encodePacked(baseSvg, combinedWord, "</text></svg>"));
		string memory json = Base64.encode(
			bytes(
				string(
					abi.encodePacked(
						'{"name": "',
						combinedWord,
						'", "description": "basically these are white words on a black background, but trust me, each one is unique and lives an awesome decentralized life.", "image": "data:image/svg+xml;base64,',
						Base64.encode(bytes(customSvg)),
						'"}'
					)
				)
			)
		);


		_safeMint(msg.sender, newItemId);
		
		string memory tokenURI = string(abi.encodePacked("data:application/json;base64,", json));

		console.log("\n--------------------");
		console.log(tokenURI);
		console.log("------------------------\n");

		_setTokenURI(newItemId, tokenURI);

		console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);

		emit NewEpicNFTMinted(msg.sender, newItemId, getMintCap());

		_tokenIdCounter.increment();
	}
	
}
