/**    
 * 文件名：TravelRecordService.java    
 *    
 * 版本信息：    
 * 日期：2015-3-12    
 * Copyright： 北京锐安科技有限公司 2015  版权所有      
 * 作者：  xushiqiang
 */
package com.bjrun.autodata.service.backend;

import java.util.List;

import com.bjrun.autodata.entity.vo.backend.TravelRecordVo;
import com.bjrun.autodata.utils.common.Pager;

/**    
 *     
 * 项目名称：rail  
 * 类名称：TravelRecordService   
 * 类描述：  
 * 创建人：xushiqiang  
 * 创建时间：2015-3-12 上午10:31:40 
 * 修改人：xushiqiang  
 * 修改时间：2015-3-12 上午10:31:40   
 * 修改备注：
 * @version     
 *     
 */
public interface TravelRecordService {

    public Pager findTravelPage(TravelRecordVo travelRecordVo);

    public List<TravelRecordVo> queryByIdS(int[] idInt);

    public List<TravelRecordVo> query4DownLoad();

    public Pager findPassengerIdentityPage(TravelRecordVo travelRecordVo);

}
