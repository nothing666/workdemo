package com.bjrun.autodata.dao;

import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.ibatis.executor.Executor;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Plugin;
import org.apache.ibatis.plugin.Signature;
import org.apache.ibatis.session.ResultHandler;
import org.apache.ibatis.session.RowBounds;

@Intercepts({ @Signature(type = Executor.class, method = "query", args = {
        MappedStatement.class, Object.class, RowBounds.class,
        ResultHandler.class }) })
public class PaginationInterceptor implements Interceptor {
    private final static int MAPPED_STATEMENT_INDEX = 0;

    private final static int PARAMETER_INDEX = 1;

    private final static int ROWBOUNDS_INDEX = 2;

    private final static String MYSQLDIALECT = "MYSQL";// mysql方言

    private final static String ORACLEDIALECT = "ORACLE";//oracle方言

    private final static String DIALECTNAME = "dialectName";// 方言名称

    protected final Log logger = LogFactory.getLog(getClass());

    Dialect dialect;

    public Object intercept(Invocation invocation) throws Throwable {
        MappedStatement ms = (MappedStatement) invocation.getArgs()[MAPPED_STATEMENT_INDEX];
        Object parameter = invocation.getArgs()[PARAMETER_INDEX];
        final RowBounds rowBounds = (RowBounds) invocation.getArgs()[ROWBOUNDS_INDEX];

        int offset = rowBounds.getOffset();// 起始位置
        int limit = rowBounds.getLimit();// 查询距离
        BoundSql boundSql = ms.getBoundSql(parameter);
        String sql = boundSql.getSql().trim();

        if (limit != 0 && limit != RowBounds.NO_ROW_LIMIT) {// 是否存在查询距离
            sql = dialect.getLimitString(sql, offset, limit);
        }
        logger.info("#########" + sql + "################");

        return invocation.proceed();
    }

    public Object plugin(Object target) {
        return Plugin.wrap(target, this);
    }

    public void setProperties(Properties properties) {
        try {
            // 获取属性值
            String dialectName = properties.getProperty(DIALECTNAME);
            if (dialectName.equalsIgnoreCase(MYSQLDIALECT)) {
                dialect = (Dialect) MysqlDialect.class.newInstance();
            } else if (dialectName.equalsIgnoreCase(ORACLEDIALECT)) {
                dialect = (Dialect) OracleDialect.class.newInstance();
            } else {
                dialect = null;
            }
        } catch (InstantiationException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }

    }

}