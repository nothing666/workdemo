/**    
 * 文件名：AccidentBaseinfoMapper.java    
 *    
 * 版本信息：    
 * 日期：2016-3-13    
 * Copyright： 北京锐安科技有限公司 2016  版权所有      
 * 作者：  徐世强
 */
package com.bjrun.autodata.dao.mapper.backend;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;

/**    
 *     
 * 项目名称：AutoData_V0.1  
 * 类名称：AccidentBaseinfoMapper   
 * 类描述：  
 * 创建人：徐世强  
 * 创建时间：2016-3-13 下午04:31:15 
 * 修改人：徐世强  
 * 修改时间：2016-3-13 下午04:31:15   
 * 修改备注：
 * @version     
 *     
 */
public interface AccidentBaseinfoMapper {

    List<Map<String, Object>> selectPage(Map<String, Object> voMap,
            RowBounds rowBounds);
    Integer selectCount(Map<String, Object> voMap);
    
    List<Map<String, Object>> selectPieDataByAccidentReason(Map<String, Object> voMap,
            RowBounds rowBounds);
}
