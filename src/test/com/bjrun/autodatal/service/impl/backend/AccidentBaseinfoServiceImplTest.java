/**    
 * 文件名：AccidentBaseinfoServiceImplTest.java    
 *    
 * 版本信息：    
 * 日期：2016-3-16    
 * Copyright： 北京锐安科技有限公司 2016  版权所有      
 * 作者：  徐世强
 */
package com.bjrun.autodatal.service.impl.backend;

import javax.annotation.Resource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Test;

import com.bjrun.autodata.SpringTestBase;
import com.bjrun.autodata.entity.vo.backend.AccidentBaseinfoVo;
import com.bjrun.autodata.service.backend.AccidentBaseinfoService;
import com.bjrun.autodata.utils.common.Pager;

/**    
 *     
 * 项目名称：AutoData_V0.1  
 * 类名称：AccidentBaseinfoServiceImplTest   
 * 类描述：  
 * 创建人：徐世强  
 * 创建时间：2016-3-16 下午01:58:38 
 * 修改人：徐世强  
 * 修改时间：2016-3-16 下午01:58:38   
 * 修改备注：
 * @version     
 *     
 */
public class AccidentBaseinfoServiceImplTest extends SpringTestBase {

    @Resource
    private AccidentBaseinfoService accidentBaseinfoService;

    protected final Log logger = LogFactory.getLog(getClass());

    @Test
    public void testAccidentBaseinfoPage() {

        AccidentBaseinfoVo accidentBaseinfoVo = new AccidentBaseinfoVo();

        accidentBaseinfoVo.setOrder("desc");
        accidentBaseinfoVo.setSort("totalCount");
        accidentBaseinfoVo.setPage(0);
        accidentBaseinfoVo.setRows(10);

        Pager pager = accidentBaseinfoService
                .selectPieDataByAccidentReason(accidentBaseinfoVo);
        if (pager != null) {
            logger.info(pager);
        }

    }

}
