/**    
 * 文件名：AccidentBaseinfoVo.java    
 *    
 * 版本信息：    
 * 日期：2016-3-13    
 * Copyright： 北京锐安科技有限公司 2016  版权所有      
 * 作者：  徐世强
 */
package com.bjrun.autodata.entity.vo.backend;

import com.bjrun.autodata.entity.dto.backend.AccidentBaseinfoDto;

/**    
 *     
 * 项目名称：AutoData_V0.1  
 * 类名称：AccidentBaseinfoVo   
 * 类描述：  
 * 创建人：徐世强  
 * 创建时间：2016-3-13 下午04:30:11 
 * 修改人：徐世强  
 * 修改时间：2016-3-13 下午04:30:11   
 * 修改备注：
 * @version     
 *     
 */
public class AccidentBaseinfoVo extends AccidentBaseinfoDto {

    private Long totalCount; //根据分类统计的个数

    public void setTotalCount(Long totalCount) {
        this.totalCount = totalCount;
    }

    public Long getTotalCount() {
        return totalCount;
    }
    
}
