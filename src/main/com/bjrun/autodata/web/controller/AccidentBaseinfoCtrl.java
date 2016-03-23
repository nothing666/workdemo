/**    
 * 文件名：AccidentBaseinfoCtrl.java    
 *    
 * 版本信息：    
 * 日期：2016-3-13    
 * Copyright： 北京锐安科技有限公司 2016  版权所有      
 * 作者：  徐世强
 */
package com.bjrun.autodata.web.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.bjrun.autodata.entity.vo.backend.AccidentBaseinfoVo;
import com.bjrun.autodata.service.backend.AccidentBaseinfoService;
import com.bjrun.autodata.utils.common.Pager;

/**    
 *     
 * 项目名称：AutoData_V0.1  
 * 类名称：AccidentBaseinfoCtrl   
 * 类描述：  
 * 创建人：徐世强  
 * 创建时间：2016-3-13 下午05:10:49 
 * 修改人：徐世强  
 * 修改时间：2016-3-13 下午05:10:49   
 * 修改备注：
 * @version     
 *     
 */
@Controller
@RequestMapping(value = "/accidentBaseinfo")
public class AccidentBaseinfoCtrl {

    protected final Log logger = LogFactory.getLog(getClass());

    private final String[] colors = { "#68BC31", "#2091CF", "#AF4E96",
            "#DA5430", "#FEE074", "#AEE074", "#0EE074", "#3EE074", "#6091CF",
            "#8091CF", "#A091CF", "#C8BC31", "#F8BC31" };

    @Resource
    private AccidentBaseinfoService accidentBaseinfoService;

    /**    
     * getPieDataByAccidentReason(交通事故事故原因统计数据)       
     *@param bookingRecordVo
     *@return Pager
    */
    @RequestMapping(value = "getPieDataByAccidentReason")
    @ResponseBody
    public JSONArray getPieDataByAccidentReason(
            AccidentBaseinfoVo accidentBaseinfoVo, HttpServletRequest req,
            HttpServletResponse res) {

        JSONArray result = new JSONArray();

        accidentBaseinfoVo.setOrder("desc");
        accidentBaseinfoVo.setSort("totalCount");
        accidentBaseinfoVo.setPage(0);
        accidentBaseinfoVo.setRows(20);

        Pager pager = accidentBaseinfoService
                .selectPieDataByAccidentReason(accidentBaseinfoVo);
        pager.setPage(accidentBaseinfoVo.getPage());

        @SuppressWarnings({ "unused", "unchecked" })
        List<AccidentBaseinfoVo> accidentBaseinfoVos = (List<AccidentBaseinfoVo>) pager
                .getRows();

        if (pager != null) {
            logger.info("query total count:" + pager.getTotal());
        }

        if (accidentBaseinfoVos != null && !accidentBaseinfoVos.isEmpty()) {
            long totalCount = 0;
            for (AccidentBaseinfoVo vo : accidentBaseinfoVos) {
                totalCount = totalCount + vo.getTotalCount();
            }

            int i = 0;

            for (AccidentBaseinfoVo vo : accidentBaseinfoVos) {
                JSONObject data = new JSONObject();

                if (vo.getAccidentPreReason().equalsIgnoreCase("5981")) {
                    data.put("label", "未设置道路安全设施");
                } else if (vo.getAccidentPreReason().equalsIgnoreCase("5982")) {
                    data.put("label", "安全设施损坏&&缺失");
                } else if (vo.getAccidentPreReason().equalsIgnoreCase("5983")) {
                    data.put("label", "道路缺陷");
                } else if (vo.getAccidentPreReason().equalsIgnoreCase("5989")) {
                    data.put("label", "其他道路原因");
                } else if (vo.getAccidentPreReason().equalsIgnoreCase("9001")) {
                    data.put("label", "制动不当");
                } else if (vo.getAccidentPreReason().equalsIgnoreCase("9002")) {
                    data.put("label", "转向不当");
                } else if (vo.getAccidentPreReason().equalsIgnoreCase("9003")) {
                    data.put("label", "油门控制不当");
                } else if (vo.getAccidentPreReason().equalsIgnoreCase("9009")) {
                    data.put("label", "其他操作不当");
                } else if (vo.getAccidentPreReason().equalsIgnoreCase("9101")) {
                    data.put("label", "自然灾害");
                } else if (vo.getAccidentPreReason().equalsIgnoreCase("9102")) {
                    data.put("label", "机件故障");
                } else if (vo.getAccidentPreReason().equalsIgnoreCase("9103")) {
                    data.put("label", "爆胎");
                } else if (vo.getAccidentPreReason().equalsIgnoreCase("9109")) {
                    data.put("label", "其他意外");
                } else if (vo.getAccidentPreReason().equalsIgnoreCase("9901")) {
                    data.put("label", "其他");
                }
                data.put("data", vo.getTotalCount() * 100 / totalCount);
                data.put("color", colors[i % colors.length]);
                i++;

                result.add(data);
            }
        }
        return result;
    }
}