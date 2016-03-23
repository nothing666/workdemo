/**    
 * 文件名：AccidentBaseinfoServiceImpl.java    
 *    
 * 版本信息：    
 * 日期：2016-3-13    
 * Copyright： 北京锐安科技有限公司 2016  版权所有      
 * 作者：  徐世强
 */
package com.bjrun.autodata.service.impl.backend;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bjrun.autodata.dao.mapper.backend.AccidentBaseinfoMapper;
import com.bjrun.autodata.entity.vo.backend.AccidentBaseinfoVo;
import com.bjrun.autodata.service.backend.AccidentBaseinfoService;
import com.bjrun.autodata.utils.common.EntityMapUtil;
import com.bjrun.autodata.utils.common.Pager;

/**    
 *     
 * 项目名称：AutoData_V0.1  
 * 类名称：AccidentBaseinfoServiceImpl   
 * 类描述：  
 * 创建人：徐世强  
 * 创建时间：2016-3-13 下午05:01:27 
 * 修改人：徐世强  
 * 修改时间：2016-3-13 下午05:01:27   
 * 修改备注：
 * @version     
 *     
 */
@Service
public class AccidentBaseinfoServiceImpl implements AccidentBaseinfoService {

    @Autowired
    private AccidentBaseinfoMapper accidentBaseinfoMapper;

    @SuppressWarnings("unchecked")
    @Override
    public Pager findAccidentBaseinfoPage(AccidentBaseinfoVo accidentBaseinfoVo) {

        RowBounds rowBounds = new RowBounds(accidentBaseinfoVo.getStartPos(),
                accidentBaseinfoVo.getRows());

        Map<String, Object> inpMap = EntityMapUtil
                .entityToMap(accidentBaseinfoVo);

        List<Map<String, Object>> outMaps = accidentBaseinfoMapper.selectPage(
                inpMap, rowBounds);

        List<AccidentBaseinfoVo> accidentBaseinfoVos = (List<AccidentBaseinfoVo>) EntityMapUtil
                .listmapToList(AccidentBaseinfoVo.class, outMaps);

        int totalCount = accidentBaseinfoMapper.selectCount(inpMap);

        Pager pager = new Pager();
        pager.setTotal(totalCount);
        pager.setRows(accidentBaseinfoVos);
        return pager;

    }

    @Override
    public Pager selectPieDataByAccidentReason(
            AccidentBaseinfoVo accidentBaseinfoVo) {

        RowBounds rowBounds = new RowBounds(accidentBaseinfoVo.getStartPos(),
                accidentBaseinfoVo.getRows());

        Map<String, Object> inpMap = EntityMapUtil
                .entityToMap(accidentBaseinfoVo);

        List<Map<String, Object>> outMaps = accidentBaseinfoMapper
                .selectPieDataByAccidentReason(inpMap, rowBounds);

        @SuppressWarnings("unchecked")
        List<AccidentBaseinfoVo> accidentBaseinfoVos = (List<AccidentBaseinfoVo>) EntityMapUtil
                .listmapToList(AccidentBaseinfoVo.class, outMaps);

        Pager pager = new Pager();
        pager.setRows(accidentBaseinfoVos);
        pager.setTotal(accidentBaseinfoVos.size());
        return pager;

    }

}
