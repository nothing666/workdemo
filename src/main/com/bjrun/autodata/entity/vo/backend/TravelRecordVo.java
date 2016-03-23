/**    
 * 文件名：TravelRecordVo.java    
 *    
 * 版本信息：    
 * 日期：2015-3-12    
 * Copyright： 北京锐安科技有限公司 2015  版权所有      
 * 作者：  xushiqiang
 */
package com.bjrun.autodata.entity.vo.backend;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import com.bjrun.autodata.entity.dto.backend.TravelRecordDto;
import com.bjrun.autodata.utils.common.StringUtils;

/**
 * 
 * 项目名称：rail 
 * 类名称：TravelRecordVo.java 
 * 类描述： 创建人：xushiqiang 创建时间：2015-3-12  上午10:31:40 
 * 修改人：xushiqiang 修改时间：2015-3-12 上午10:31:40 
 * 修改备注：
 * 
 * @version
 * 
 */
public class TravelRecordVo extends TravelRecordDto {

    private Date beginTime;

    private Date endTime;

    private String btime;

    private String etime;

    private String keyWord;

    // 配合页面的年龄段搜索
    private int beginAge;

    private int endAge;

    //配合前台的户籍查询
    private String province;

    //配合mybatis的后台foreach查询
    private List<String> provinceList;

    //配合乘车信息的二次搜索功能
    private String secondSearch;

    /* 支持同类型参数的多条件查询,如：姓名:aa;姓名:bb  begin*/

    //配合后台的姓名多条件查询
    private List<String> multiXm;

    //配合后台的手机号多条件查询
    private List<String> multiSjh;

    //配合后台的身份证号多条件查询
    private List<String> multiSfzh;

    //配合后台的订票邮箱多条件查询
    private List<String> multiDpyx;

    //配合后台的车次多条件查询
    private List<String> multiCc;

    //配合后台的出发地多条件查询
    private List<String> multiCfd;

    //配合后台的目的地多条件查询
    private List<String> multiMdd;

    /* 支持同类型参数的多条件查询, end  */

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public Date getBeginTime() {
        return beginTime;
    }

    public void setBeginTime(Date beginTime) {
        this.beginTime = beginTime;
    }

    public String getKeyWord() {
        return keyWord;
    }

    public void setKeyWord(String keyWord) {
        this.keyWord = keyWord;
    }

    public int getBeginAge() {
        return beginAge;
    }

    public void setBeginAge(int beginAge) {
        this.beginAge = beginAge;
    }

    public int getEndAge() {
        return endAge;
    }

    public void setEndAge(int endAge) {
        this.endAge = endAge;
    }

    public void setBtime(String btime) throws ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        setBeginTime(sdf.parse(btime));
        this.btime = btime;
    }

    public String getEtime() {
        return etime;
    }

    public void setEtime(String etime) throws ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        setEndTime(sdf.parse(etime));
        this.etime = etime;
    }

    public String getBtime() {
        return btime;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public List<String> getProvinceList() {
        return provinceList;
    }

    public void setProvinceList(List<String> provinceList) {
        this.provinceList = provinceList;
    }

    public String getSecondSearch() {
        return secondSearch;
    }

    public void setSecondSearch(String secondSearch) {
        this.secondSearch = secondSearch;
    }

    public List<String> getMultiXm() {
        return multiXm;
    }

    public void setMultiXm(List<String> multiXm) {
        this.multiXm = multiXm;
    }

    //针对乘车记录、乘车人身份对sql进行拼接]多条件查询
    @Override
    public void setPassenger(String passenger) {
        this.passenger = passenger;
        if (!StringUtils.isNullOrEmpty(passenger)) {
            multiXm = Arrays.asList(passenger.split(","));
        }

    }

    public List<String> getMultiSjh() {
        return multiSjh;
    }

    public void setMultiSjh(List<String> multiSjh) {
        this.multiSjh = multiSjh;
    }

    //针对手机号多条件查询
    @Override
    public void setMobile(String mobile) {
        this.mobile = mobile;
        if (!StringUtils.isNullOrEmpty(mobile)) {
            multiSjh = Arrays.asList(mobile.split(","));
        }
    }

    public List<String> getMultiSfzh() {
        return multiSfzh;
    }

    public void setMultiSfzh(List<String> multiSfzh) {
        this.multiSfzh = multiSfzh;
    }

    //针对身份证号多条件查询
    @Override
    public void setCertificateCode(String certificateCode) {
        this.certificateCode = certificateCode;
        if (!StringUtils.isNullOrEmpty(certificateCode)) {
            multiSfzh = Arrays.asList(certificateCode.split(","));
        }
    }

    public List<String> getMultiDpyx() {
        return multiDpyx;
    }

    public void setMultiDpyx(List<String> multiDpyx) {
        this.multiDpyx = multiDpyx;
    }

    //针对订票邮箱多条件查询
    @Override
    public void setBookingMail(String bookingMail) {
        this.bookingMail = bookingMail;
        if (!StringUtils.isNullOrEmpty(bookingMail)) {
            multiDpyx = Arrays.asList(bookingMail.split(","));
        }
    }

    public List<String> getMultiCc() {
        return multiCc;
    }

    public void setMultiCc(List<String> multiCc) {
        this.multiCc = multiCc;
    }

    //针对车次多条件查询
    @Override
    public void setTrainNumber(String trainNumber) {
        this.trainNumber = trainNumber;
        if (!StringUtils.isNullOrEmpty(trainNumber)) {
            multiCc = Arrays.asList(trainNumber.split(","));
        }
    }

    public List<String> getMultiCfd() {
        return multiCfd;
    }

    public void setMultiCfd(List<String> multiCfd) {
        this.multiCfd = multiCfd;
    }

    //针对出发地多条件查询
    @Override
    public void setDepartureStation(String departureStation) {
        this.departureStation = departureStation;
        if (!StringUtils.isNullOrEmpty(departureStation)) {
            multiCfd = Arrays.asList(departureStation.split(","));
        }
    }

    public List<String> getMultiMdd() {
        return multiMdd;
    }

    public void setMultiMdd(List<String> multiMdd) {
        this.multiMdd = multiMdd;
    }

    //针对目的地多条件查询
    @Override
    public void setTerminalStation(String terminalStation) {
        this.terminalStation = terminalStation;
        if (!StringUtils.isNullOrEmpty(terminalStation)) {
            multiMdd = Arrays.asList(terminalStation.split(","));
        }
    }
}
