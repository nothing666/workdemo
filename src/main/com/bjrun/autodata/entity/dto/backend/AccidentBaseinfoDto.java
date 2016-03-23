/**    
 * 文件名：AccidentBaseinfoDto.java    
 *    
 * 版本信息：    
 * 日期：2016-3-13    
 * Copyright： 北京锐安科技有限公司 2016  版权所有      
 * 作者：  徐世强
 */
package com.bjrun.autodata.entity.dto.backend;

import com.bjrun.autodata.entity.BaseEntity;

/**    
 *     
 * 项目名称：AutoData_V0.1  
 * 类名称：AccidentBaseinfoDto   
 * 类描述：  
 * 创建人：徐世强  
 * 创建时间：2016-3-13 下午03:56:44 
 * 修改人：徐世强  
 * 修改时间：2016-3-13 下午03:56:44   
 * 修改备注：
 * @version     
 *     
 */
public class AccidentBaseinfoDto extends BaseEntity {
    
    
    private Long accidentId;  //事故ID
    
    private String accidentPlace;//事故发生地
    
    private Long  accidentCasualtiesId ;//事故伤亡情况ID
    
    private String accidentForm ;//事故形态
    
    private Long accidentDetailId;  //事故详情ID
    
    private String accidentSiteForm;//事故现场形态
    
    private String  accidentPreReason ;//事故预判原因
    
    public Long getAccidentId() {
        return accidentId;
    }
    public void setAccidentId(Long accidentId) {
        this.accidentId = accidentId;
    }
    public String getAccidentPlace() {
        return accidentPlace;
    }
    public void setAccidentPlace(String accidentPlace) {
        this.accidentPlace = accidentPlace;
    }
    public Long getAccidentCasualtiesId() {
        return accidentCasualtiesId;
    }
    public void setAccidentCasualtiesId(Long accidentCasualtiesId) {
        this.accidentCasualtiesId = accidentCasualtiesId;
    }
    public String getAccidentForm() {
        return accidentForm;
    }
    public void setAccidentForm(String accidentForm) {
        this.accidentForm = accidentForm;
    }
    public Long getAccidentDetailId() {
        return accidentDetailId;
    }
    public void setAccidentDetailId(Long accidentDetailId) {
        this.accidentDetailId = accidentDetailId;
    }
    public String getAccidentSiteForm() {
        return accidentSiteForm;
    }
    public void setAccidentSiteForm(String accidentSiteForm) {
        this.accidentSiteForm = accidentSiteForm;
    }
    public String getAccidentPreReason() {
        return accidentPreReason;
    }
    public void setAccidentPreReason(String accidentPreReason) {
        this.accidentPreReason = accidentPreReason;
    }


    

}
