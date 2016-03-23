/**    
 * 文件名：AccidentBaseinfoService.java    
 *    
 * 版本信息：    
 * 日期：2016-3-13    
 * Copyright： 北京锐安科技有限公司 2016  版权所有      
 * 作者：  徐世强
 */
package com.bjrun.autodata.service.backend;

import com.bjrun.autodata.entity.vo.backend.AccidentBaseinfoVo;
import com.bjrun.autodata.utils.common.Pager;

/**    
 *     
 * 项目名称：AutoData_V0.1  
 * 类名称：AccidentBaseinfoService   
 * 类描述：  
 * 创建人：徐世强  
 * 创建时间：2016-3-13 下午04:59:17 
 * 修改人：徐世强  
 * 修改时间：2016-3-13 下午04:59:17   
 * 修改备注：
 * @version     
 *     
 */
public interface AccidentBaseinfoService {
    
    public Pager findAccidentBaseinfoPage(AccidentBaseinfoVo accidentBaseinfoVo);
    public Pager selectPieDataByAccidentReason(AccidentBaseinfoVo accidentBaseinfoVo);

}
