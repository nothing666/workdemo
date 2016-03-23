/**    
 * 文件名：TravelRecordServiceImplTest.java    
 *    
 * 版本信息：    
 * 日期：2015-3-12    
 * Copyright： 北京锐安科技有限公司 2015  版权所有      
 * 作者：  xushiqiang
 */
package com.bjrun.autodatal.service.impl.backend;

import java.util.Date;

import javax.annotation.Resource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Test;

import com.bjrun.autodata.SpringTestBase;
import com.bjrun.autodata.entity.vo.backend.TravelRecordVo;
import com.bjrun.autodata.service.backend.TravelRecordService;
import com.bjrun.autodata.utils.common.Pager;

/**    
 *     
 * 项目名称：rail  
 * 类名称：TravelRecordServiceImplTest   
 * 类描述：  
 * 创建人：xushiqiang  
 * 创建时间：2015-3-12 上午9:48:44 
 * 修改人：xushiqiang  
 * 修改时间：2015-3-12 上午9:48:44   
 * 修改备注：
 * @version     
 *     
 */
public class TravelRecordServiceImplTest extends SpringTestBase {

    @Resource
    private TravelRecordService travelRecordService;

    protected final Log logger = LogFactory.getLog(getClass());

    @Test
    public void testFindPage() {

        TravelRecordVo travelRecordVo = new TravelRecordVo();

        travelRecordVo.setOrder("asc");
        travelRecordVo.setPage(1);
        travelRecordVo.setRows(5);
        travelRecordVo.setSort("ticketorder");

        travelRecordVo.setEndTime(new Date());
        travelRecordVo.setBookingMail("receiver@qq.com");
        //travelRecordVo.setKeyWord("张");
        travelRecordVo.setBeginAge(27);

        travelRecordVo.setEndAge(60);

        //travelRecordVo.setPassengerName("张三");

        Pager pager = travelRecordService.findTravelPage(travelRecordVo);
        if (pager != null) {
            logger.info(pager);
        }

    }
}
