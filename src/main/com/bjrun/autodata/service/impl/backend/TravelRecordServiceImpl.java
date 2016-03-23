/**    
 * 文件名：TravelRecordServiceImpl.java    
 *    
 * 版本信息：    
 * 日期：2015-3-12    
 * Copyright： 北京锐安科技有限公司 2015  版权所有      
 * 作者：  xushiqiang
 */
package com.bjrun.autodata.service.impl.backend;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bjrun.autodata.dao.mapper.backend.TravelRecordMapper;
import com.bjrun.autodata.entity.vo.backend.TravelRecordVo;
import com.bjrun.autodata.service.backend.TravelRecordService;
import com.bjrun.autodata.utils.common.EntityMapUtil;
import com.bjrun.autodata.utils.common.Pager;



/**    
 *     
 * 项目名称：rail  
 * 类名称：TravelRecordServiceImpl   
 * 类描述：  
 * 创建人：xushiqiang  
 * 创建时间：2015-3-12 下午4:40:21 
 * 修改人：xushiqiang  
 * 修改时间：2015-3-12 下午4:40:21   
 * 修改备注：
 * @version     
 *     
 */
@Service
public class TravelRecordServiceImpl implements TravelRecordService {

    @Autowired
    private TravelRecordMapper travelRecordMapper;

    @Override
    public Pager findTravelPage(TravelRecordVo travelRecordVo) {

        RowBounds rowBounds = new RowBounds(travelRecordVo.getStartPos(),
                travelRecordVo.getRows());

        Map<String, Object> inpMap = EntityMapUtil.entityToMap(travelRecordVo);

        List<Map<String, Object>> outMaps = travelRecordMapper.selectPage(
                inpMap, rowBounds);
        @SuppressWarnings("unchecked")
        List<TravelRecordVo> travelRecordVos = (List<TravelRecordVo>) EntityMapUtil
                .listmapToList(TravelRecordVo.class, outMaps);

        int totalCount = travelRecordMapper.selectCount(inpMap);

        Pager pager = new Pager();
        pager.setTotal(totalCount);
        pager.setRows(travelRecordVos);
        return pager;

    }

    @Override
    public List<TravelRecordVo> queryByIdS(int[] idInt) {

        if (idInt != null && idInt.length > 0) {
            List<Map<String, Object>> outMaps = travelRecordMapper
                    .queryByIdS(idInt);

            if (outMaps != null && !outMaps.isEmpty()) {
                @SuppressWarnings("unchecked")
                List<TravelRecordVo> travelRecordVos = (List<TravelRecordVo>) EntityMapUtil
                        .listmapToList(TravelRecordVo.class, outMaps);
                return travelRecordVos;
            }
        }

        return new ArrayList<TravelRecordVo>();
    }

    @Override
    public List<TravelRecordVo> query4DownLoad() {

        List<Map<String, Object>> outMaps = travelRecordMapper.query4DownLoad();

        if (outMaps != null && !outMaps.isEmpty()) {
            @SuppressWarnings("unchecked")
            List<TravelRecordVo> travelRecordVos = (List<TravelRecordVo>) EntityMapUtil
                    .listmapToList(TravelRecordVo.class, outMaps);
            return travelRecordVos;

        }
        return new ArrayList<TravelRecordVo>();
    }

    @Override
    public Pager findPassengerIdentityPage(TravelRecordVo travelRecordVo) {

        RowBounds rowBounds = new RowBounds(travelRecordVo.getStartPos(),
                travelRecordVo.getRows());

        Map<String, Object> inpMap = EntityMapUtil.entityToMap(travelRecordVo);

        List<Map<String, Object>> outMaps = travelRecordMapper
                .selectPassengerIdentityPage(inpMap, rowBounds);

        @SuppressWarnings("unchecked")
        List<TravelRecordVo> travelRecordVos = (List<TravelRecordVo>) EntityMapUtil
                .listmapToList(TravelRecordVo.class, outMaps);

        //兼容订票人姓名、乘车人姓名为空的场景,，当乘车人姓名为空时，删除该记录
        int filterNum = 0;
        if (travelRecordVos != null && travelRecordVos.size() > 0) {
            for (TravelRecordVo vo : travelRecordVos) {
                if (vo.getBooker() == null) {
                    vo.setBooker("");
                }
                if (vo.getPassenger() == null
                        || vo.getPassenger().length() <= 0) {
                    vo.setPassenger("");
                    travelRecordVos.remove(vo);
                    filterNum++;
                }
            }
        }
        int totalCount = travelRecordMapper
                .selectPassengerIdentityCount(inpMap);

        Pager pager = new Pager();
        pager.setTotal(totalCount - filterNum);
        pager.setRows(travelRecordVos);
        return pager;

    }

}
