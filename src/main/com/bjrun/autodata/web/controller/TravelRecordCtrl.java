/**    
 * 文件名：TravelRecordCtrl.java    
 *    
 * 版本信息：    
 * 日期：2015-3-16    
 * Copyright： 北京锐安科技有限公司 2015  版权所有      
 * 作者：  xushiqiang
 */
package com.bjrun.autodata.web.controller;

import java.util.ArrayList;
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
import com.bjrun.autodata.entity.vo.backend.TravelRecordVo;
import com.bjrun.autodata.service.backend.TravelRecordService;
import com.bjrun.autodata.utils.common.Pager;
import com.bjrun.autodata.utils.common.StringUtils;

/**    
 *     
 * 项目名称：rail  
 * 类名称：TravelRecordCtrl   
 * 类描述：  
 * 创建人：xushiqiang  
 * 创建时间：2015-3-16 上午10:46:48 
 * 修改人：xushiqiang  
 * 修改时间：2015-3-16 上午10:46:48   
 * 修改备注：
 * @version     
 *     
 */
@Controller
@RequestMapping(value = "/travelRecord")
public class TravelRecordCtrl {

    protected final Log logger = LogFactory.getLog(getClass());

    @Resource
    private TravelRecordService travelRecordService;

    @RequestMapping(value = "queryTravelPage")
    @ResponseBody
    public Pager queryTravelPage(TravelRecordVo travelRecordVo,
            HttpServletRequest req, HttpServletResponse res) {

        //设置户籍归属属性、配合mybatis foreach使用
        setVoProvinceArrPara(travelRecordVo);

        Pager pager = travelRecordService.findTravelPage(travelRecordVo);
        pager.setPage(travelRecordVo.getPage());
        if (pager != null) {
            logger.info("query total count:" + pager.getTotal());
        }

        return pager;
    }

    /* 通过前台传递的 province属性(字符串型,格式为'1','2');转化该参数为数组
     * 配合mybatis后台的户籍归属的foreach使用
     * 
     * */
    private void setVoProvinceArrPara(TravelRecordVo vo) {
        if (vo != null) {
            String province = vo.getProvince();
            if (!StringUtils.isNullOrEmpty(province)) {
                String[] provinceArrPara = province.split(",");
                List<String> provinceList = new ArrayList<String>();
                int len = provinceArrPara.length;
                for (int i = 0; i < len; i++) {
                    provinceList.add(provinceArrPara[i]);
                }
                vo.setProvinceList(provinceList);
            }
        }
    }

    /**    
     * findBookerIdentityPage(获取乘车身份记录)       
     *@param bookingRecordVo
     *@return Pager
    */
    @RequestMapping(value = "findPassengerIdentityPage")
    @ResponseBody
    public JSONObject findPassengerIdentityPage(TravelRecordVo travelRecordVo,
            HttpServletRequest req, HttpServletResponse res) {

        //设置户籍归属属性、配合mybatis foreach使用
        setVoProvinceArrPara(travelRecordVo);

        Pager pager = travelRecordService
                .findPassengerIdentityPage(travelRecordVo);
        pager.setPage(travelRecordVo.getPage());

        JSONObject data = new JSONObject();

        @SuppressWarnings({ "unused", "unchecked" })
        List<TravelRecordVo> travelRecordVos = (List<TravelRecordVo>) pager
                .getRows();

        if (pager != null) {
            logger.info("query total count:" + pager.getTotal());
        }

        if (travelRecordVos != null && !travelRecordVos.isEmpty()) {
            JSONArray result = buildIdentityInfo(travelRecordVos);

            data.put("total", pager.getTotal());
            data.put("page", pager.getPage());
            data.put("result", result);

            JSONArray headData = new JSONArray();
            JSONObject showData = new JSONObject();
            showData.put("name", "passenger");
            showData.put("display", "");
            headData.add(showData);

            JSONObject showData1 = new JSONObject();
            showData1.put("name", "bookingMail");
            showData1.put("display", "");
            headData.add(showData1);

            data.put("head", headData);

        } else {
            data.put("total", 0);
        }
        return data;

    }

    private JSONArray buildIdentityInfo(List<TravelRecordVo> travelRecordVos) {

        JSONArray result = new JSONArray();

        if (travelRecordVos != null && !travelRecordVos.isEmpty()) {
            for (TravelRecordVo vo : travelRecordVos) {
                JSONObject info = new JSONObject();
                JSONObject voObject = new JSONObject();
                voObject.put("booker", vo.getBooker());
                voObject.put("bookingMail", vo.getBookingMail());
                voObject.put("ticketOrder", vo.getTicketOrder());
                voObject.put("trainNumber", vo.getTrainNumber());
                voObject.put("departureStation", vo.getDepartureStation());
                voObject.put("terminalStation", vo.getTerminalStation());
                voObject.put("passenger", vo.getPassenger());
                voObject.put("certificateCode", vo.getCertificateCode());
                voObject.put("mobile", vo.getMobile());

                info.put("id", trimC(vo.getBookingMail()));
                info.put("cell", voObject);
                result.add(info);
            }
        }
        return result;
    }

    //针对id,将@ 。 号进行处理
    private String trimC(String bookingMail) {
        String a = bookingMail.replaceAll("@", "");

        return a.replaceAll("\\.", "");
    }
}
