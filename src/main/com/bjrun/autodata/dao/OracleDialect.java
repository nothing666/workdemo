package com.bjrun.autodata.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class OracleDialect implements Dialect {

    protected static final String SQL_END_DELIMITER = ";";

    protected final Log logger = LogFactory.getLog(getClass());

    public String getLimitString(String sql, int offset, int limit) {

        sql = trim(sql);
        StringBuffer sb = new StringBuffer(sql.length() + 40);
        sb.append(sql);
        logger.info(offset + "offset > 0");

        if (offset > 0 && limit > 0) {
            sb.append(" rownum  <= ").append(offset + limit);
            sb.append(" and rownum  > ").append(offset);
        }
        return sb.toString();
    }

    private String trim(String sql) {
        sql = sql.trim();
        if (sql.endsWith(SQL_END_DELIMITER)) {
            sql = sql.substring(0,
                    sql.length() - 1 - SQL_END_DELIMITER.length());
        }
        return sql;
    }

    public boolean supportsLimitOffset() {
        return true;
    }

    @Override
    public boolean supportsLimit() {
        // TODO Auto-generated method stub
        return false;
    }

}