/**    
 * 文件名：TravelRecordMapper.java    
 *    
 * 版本信息：    
 * 日期：2015-3-13    
 * Copyright： 北京锐安科技有限公司 2015  版权所有      
 * 作者：  xushiqiang
 */
package com.bjrun.autodata.dao.mapper.backend;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;

/**    
 *     
 * 项目名称：rail  
 * 类名称：TravelRecordMapper   
 * 类描述：  
 * 创建人：xushiqiang  
 * 创建时间：2015-3-13 下午5:51:56 
 * 修改人：xushiqiang  
 * 修改时间：2015-3-13 下午5:51:56   
 * 修改备注：
 * @version     
 *     
 */
public interface TravelRecordMapper {

    List<Map<String, Object>> selectPage(Map<String, Object> voMap,
            RowBounds rowBounds);

    List<Map<String, Object>> quallAll(Map<String, Object> voMap);

    Integer selectCount(Map<String, Object> voMap);

    List<Map<String, Object>> queryByIdS(int[] idInt);

    //默认的下载数据库前5000条
    List<Map<String, Object>> query4DownLoad();

    //查询乘车人身份信息
    List<Map<String, Object>> selectPassengerIdentityPage(
            Map<String, Object> inpMap, RowBounds rowBounds);

    Integer selectPassengerIdentityCount(Map<String, Object> voMap);
}
