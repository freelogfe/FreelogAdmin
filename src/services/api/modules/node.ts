// TODO 使用namespace来做
import { Api } from '../index'
interface Node {
    [propName: string]: Api
}
// TODO 使用namespace来做

// TODO  需要给data或params定义类型 
const node: Node = {}

// 用户管理
node.getNodes = {
  url: '/api/nodes/count',
  method: 'GET',
  params: {
    userIds: 'string'
  }
}
export default node;