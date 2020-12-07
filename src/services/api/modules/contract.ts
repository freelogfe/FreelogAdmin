import { Api } from '../index'
interface Contract {
    [propName: string]: Api
}
// TODO 使用namespace来做

// TODO  需要给data或params定义类型 
const contract: Contract = {}

// 用户管理
contract.getContracts = {
  url: '/api/contracts/count',
  method: 'GET',
  params: {
    userIds: 'string'
  }
}
export default contract;