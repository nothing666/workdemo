package com.bjrun.autodata.dao;

public interface Dialect {
    public boolean supportsLimit();

    /**
     * 
     * getLimitString(沿用了mysql的接口定义,在oracle中limit:查找条数;offset:查找的起始记录数)       
     *@param sql
     *@param limit 查找条数
     *@param offset 查找的起始记录数
     *@return
     */
    public String getLimitString(String sql, int offset, int limit);

}
