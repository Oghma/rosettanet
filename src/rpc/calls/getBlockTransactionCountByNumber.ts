import { RPCError, RPCRequest, RPCResponse } from '../../types/types'
import { callStarknet } from '../../utils/callHelper'
import { validateBlockHash, validateBlockNumber } from '../../utils/validations'

export async function getBlockTransactionCountByHashHandler(
  request: RPCRequest,
): Promise<RPCResponse | RPCError> {
  // TODO: Dynamic network from env?
  const network = 'testnet'
  const method = 'starknet_getBlockTransactionCount'

  // Validate request parameters
  if (request.params.length == 0) {
    return {
      code: 7979,
      message: 'Starknet RPC Error',
      data: 'Params should not be empty',
    }
  }

  // Validate block number
  const blockNumber = request.params[0] as string
  if (!validateBlockNumber(blockNumber)) {
    return {
      code: 7979,
      message: 'Starknet RPC error',
      data: 'Invalid block number',
    }
  }

  const response: RPCResponse | string = await callStarknet(network, {
    jsonrpc: request.jsonrpc,
    method,
    params: [
      {
        block_number: blockNumber,
      },
    ],
    id: request.id,
  })

  if (
    typeof response === 'string' ||
    response === null ||
    response === undefined
  ) {
    return {
      code: 7979,
      message: 'Starknet RPC error',
      data: response,
    }
  }

  response.result = '0x' + response.result.toString(16)

  return {
    jsonrpc: '2.0',
    id: 1,
    result: response.result,
  }
}