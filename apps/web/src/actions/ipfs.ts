"use server";

import axios from "axios";

// Metaplex NFT Metadata types
interface MetaplexNFTMetadata {
  name: string;
  symbol?: string;
  description?: string;
  seller_fee_basis_points?: number;
  image: string;
  animation_url?: string;
  external_url?: string;
  attributes?: MetaplexAttribute[];
  collection?: {
    name?: string;
    family?: string;
  };
  properties?: {
    files?: Array<{
      uri: string;
      type: string;
      cdn?: boolean;
    }>;
    category?: string;
    creators?: Array<{
      address: string;
      share: number;
    }>;
  };
}

interface MetaplexAttribute {
  trait_type: string;
  value: string | number;
  display_type?: string;
}

// Pinata metadata interface
interface PinataMetadata {
  name?: string;
  keyvalues?: Record<string, string>;
}

// Axios client configuration
const axiosClient = axios.create({
  baseURL: "https://api.pinata.cloud",
  headers: {
    Authorization: `Bearer ${process.env.PINATA_JWT || ""}`,
  },
});

/**
 * Validates and formats JSON data according to Metaplex NFT metadata standards
 * @param jsonData User provided JSON data
 * @returns Formatted Metaplex metadata
 */
function formatMetaplexMetadata(
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  jsonData: Record<string, any>
): MetaplexNFTMetadata {
  // Ensure required Metaplex fields exist
  if (!jsonData.name) {
    throw new Error("Metaplex metadata requires a 'name' field");
  }

  if (!jsonData.image) {
    throw new Error(
      "Metaplex metadata requires an 'image' field with IPFS URI"
    );
  }

  // Create a properly formatted metadata object
  const metaplexMetadata: MetaplexNFTMetadata = {
    name: jsonData.name,
    description: jsonData.description || "",
    image: jsonData.image,
  };

  // Add optional fields if provided
  if (jsonData.symbol) metaplexMetadata.symbol = jsonData.symbol;
  if (jsonData.seller_fee_basis_points)
    metaplexMetadata.seller_fee_basis_points = jsonData.seller_fee_basis_points;
  if (jsonData.animation_url)
    metaplexMetadata.animation_url = jsonData.animation_url;
  if (jsonData.external_url)
    metaplexMetadata.external_url = jsonData.external_url;

  // Handle attributes
  if (jsonData.attributes && Array.isArray(jsonData.attributes)) {
    metaplexMetadata.attributes = jsonData.attributes;
  }

  // Handle collection
  if (jsonData.collection) {
    metaplexMetadata.collection = jsonData.collection;
  }

  // Handle properties and creators
  if (jsonData.properties) {
    metaplexMetadata.properties = jsonData.properties;
  }

  return metaplexMetadata;
}

/**
 * Upload JSON data to IPFS formatted for Metaplex NFT metadata standards
 * @param jsonData The NFT metadata to upload
 * @param metadata Optional Pinata metadata
 * @returns IPFS CID (Content Identifier)
 */
export async function uploadJSON(
  jsonData: Record<string, any>,
  metadata?: PinataMetadata
): Promise<string> {
  try {
    // Format the JSON data for Metaplex if not already formatted
    const metaplexData = formatMetaplexMetadata(jsonData);

    // Set default Pinata metadata if none provided
    const pinataMetadata: PinataMetadata = metadata || {
      name: `${metaplexData.name}-metadata.json`,
      keyvalues: {
        type: "metaplex-nft",
        timestamp: Date.now().toString(),
      },
    };

    const response = await axiosClient.post("/pinning/pinJSONToIPFS", {
      pinataContent: metaplexData,
      pinataMetadata: pinataMetadata,
    });

    // Return the IPFS hash/CID
    return response.data.IpfsHash;
  } catch (error) {
    console.error("Failed to upload Metaplex metadata:", error);
    throw new Error(
      `Failed to upload Metaplex metadata: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Update metadata for a pinned file
 * @param cid IPFS Content Identifier
 * @param metadata Key-value pairs for Pinata metadata
 */
export async function updateMetadata(
  cid: string,
  metadata: Record<string, string>
): Promise<void> {
  try {
    await axiosClient.put("/pinning/hashMetadata", {
      ipfsPinHash: cid,
      keyvalues: metadata,
    });
  } catch (error) {
    console.error("Failed to update metadata:", error);
    throw new Error(
      `Failed to update metadata: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Get NFT metadata from IPFS by its CID
 * @param cid IPFS Content Identifier
 * @returns Metaplex NFT metadata object
 */
export async function getNFTMetadata(
  cid: string
): Promise<MetaplexNFTMetadata> {
  try {
    const response = await axios.get(`https://ipfs.io/ipfs/${cid}`);
    return response.data as MetaplexNFTMetadata;
  } catch (error) {
    console.error("Failed to fetch NFT metadata:", error);
    throw new Error(
      `Failed to fetch NFT metadata: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
