
import { Api } from '../index'
interface Resource {
    [propName: string]: Api
}
// TODO 使用namespace来做

// TODO  需要给data或params定义类型 
const resource: Resource = {}

// 用户管理
resource.getResources = {
  url: '/api/resources/count',
  method: 'GET',
  params: {
    userIds: 'string'
  }
}
export default resource;