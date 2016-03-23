/**    
 * 文件名：TravelRecordDto.java    
 *    
 * 版本信息：    
 * 日期：2015-3-12    
 * Copyright： 北京锐安科技有限公司 2015  版权所有      
 * 作者：  xushiqiang
 */
package com.bjrun.autodata.entity.dto.backend;

import java.util.Date;

import com.bjrun.autodata.entity.BaseEntity;

/**    
 *     
 * 项目名称：rail  
 * 类名称：TravelRecordDto.java   
 * 类描述：  
 * 创建人：xushiqiang  
 * 创建时间：2015-3-12 上午10:31:40 
 * 修改人：xushiqiang  
 * 修改时间：2015-3-12 上午10:31:40   
 * 修改备注：
 * @version     
 *     
 */
public class TravelRecordDto extends BaseEntity {

    protected String passenger = "";

    protected String mobile = "";

    protected String certificateCode = "";

    protected String trainNumber = "";

    private String grade = "";

    private String carriage = "";

    private String seat = "";

    protected String departureStation = "";

    protected String terminalStation = "";

    private Date trainTime;

    private Date arriveTime;

    protected String bookingMail = "";

    //乘车人类型
    private String pType = "";

    private String booker = "";

    private String ticketOrder = "";

    //记录的唯一标识
    private Long id;

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getCertificateCode() {
        return certificateCode;
    }

    public void setCertificateCode(String certificateCode) {
        this.certificateCode = certificateCode;
    }

    public String getTrainNumber() {
        return trainNumber;
    }

    public void setTrainNumber(String trainNumber) {
        this.trainNumber = trainNumber;
    }

    public String getDepartureStation() {
        return departureStation;
    }

    public void setDepartureStation(String departureStation) {
        this.departureStation = departureStation;
    }

    public String getTerminalStation() {
        return terminalStation;
    }

    public void setTerminalStation(String terminalStation) {
        this.terminalStation = terminalStation;
    }

    public Date getTrainTime() {
        return trainTime;
    }

    public void setTrainTime(Date trainTime) {
        this.trainTime = trainTime;
    }

    public Date getArriveTime() {
        return arriveTime;
    }

    public void setArriveTime(Date arriveTime) {
        this.arriveTime = arriveTime;
    }

    public String getBookingMail() {
        return bookingMail;
    }

    public void setBookingMail(String bookingMail) {
        this.bookingMail = bookingMail;
    }

    public String getTicketOrder() {
        return ticketOrder;
    }

    public void setTicketOrder(String ticketOrder) {
        this.ticketOrder = ticketOrder;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getCarriage() {
        return carriage;
    }

    public void setCarriage(String carriage) {
        this.carriage = carriage;
    }

    public String getSeat() {
        return seat;
    }

    public void setSeat(String seat) {
        this.seat = seat;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBooker() {
        return booker;
    }

    public void setBooker(String booker) {
        this.booker = booker;
    }

    public String getpType() {
        return pType;
    }

    public void setpType(String pType) {
        this.pType = pType;
    }

    public String getPassenger() {
        return passenger;
    }

    public void setPassenger(String passenger) {
        this.passenger = passenger;

    }

}
