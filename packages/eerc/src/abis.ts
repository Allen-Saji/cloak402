export const ENTRYPOINT_ABI = [
  "function handleOps((address sender,uint256 nonce,bytes initCode,bytes callData,bytes32 accountGasLimits,uint256 preVerificationGas,bytes32 gasFees,bytes paymasterAndData,bytes signature)[] ops, address payable beneficiary)",
  "function getUserOpHash((address sender,uint256 nonce,bytes initCode,bytes callData,bytes32 accountGasLimits,uint256 preVerificationGas,bytes32 gasFees,bytes paymasterAndData,bytes signature) userOp) view returns (bytes32)",
  "function getNonce(address sender, uint192 key) view returns (uint256)",
  "function depositTo(address account) payable",
  "function balanceOf(address account) view returns (uint256)",
  "event UserOperationEvent(bytes32 indexed userOpHash, address indexed sender, address indexed paymaster, uint256 nonce, bool success, uint256 actualGasCost, uint256 actualGasUsed)",
] as const;

export const SIMPLE_ACCOUNT_FACTORY_ABI = [
  "function createAccount(address owner, uint256 salt) returns (address)",
  "function getAddress(address owner, uint256 salt) view returns (address)",
] as const;

export const SIMPLE_ACCOUNT_ABI = [
  "function execute(address dest, uint256 value, bytes func)",
] as const;

export const REGISTRAR_ABI = [
  "function register(((uint256[2],uint256[2][2],uint256[2]),uint256[5]) proof)",
  "function isUserRegistered(address user) view returns (bool)",
  "function getUserPublicKey(address user) view returns (uint256[2])",
] as const;

export const ENCRYPTED_ERC_ABI = [
  "function transfer(address to, uint256 tokenId, ((uint256[2],uint256[2][2],uint256[2]),uint256[32]) proof, uint256[7] balancePCT)",
  "function deposit(uint256 amount, address tokenAddress, uint256[7] amountPCT)",
  "function balanceOf(address user, uint256 tokenId) view returns (((uint256 x, uint256 y) c1, (uint256 x, uint256 y) c2) eGCT, uint256 nonce, (uint256[7] pct, uint256 index)[] amountPCTs, uint256[7] balancePCT, uint256 transactionIndex)",
  "function auditorPublicKey() view returns (uint256 x, uint256 y)",
  "function tokenIds(address tokenAddress) view returns (uint256)",
  "function setAuditorPublicKey(address user)",
  "function owner() view returns (address)",
  "event PrivateTransfer(address indexed from, address indexed to, uint256[7] auditorPCT, address indexed auditorAddress)",
] as const;

export const TRANSFER_VERIFIER_ABI = [
  "function verifyProof(uint256[2] a, uint256[2][2] b, uint256[2] c, uint256[32] publicSignals) view returns (bool)",
] as const;

export const ERC20_ABI = [
  "function approve(address spender, uint256 value) returns (bool)",
  "function transfer(address to, uint256 value) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
] as const;
