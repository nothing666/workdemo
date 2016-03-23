package com.bjrun.autodata.entity;

public class BaseEntity {
    private String order;//排序方式

    private String sort;//排序字段

    private int page;//返回view的页数

    private int rows;//返回view的行数

    private Long sessionId;

    public String getOrder() {
        return order;
    }

    public void setOrder(String order) {
        this.order = order;
    }

    public String getSort() {
        return sort;
    }

    public void setSort(String sort) {
        this.sort = sort;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        if (0 == page) {
            page = 1;
        }
        this.page = page;
    }

    public int getRows() {
        return rows;
    }

    public void setRows(int rows) {
        this.rows = rows;
    }

    public int getStartPos() {
        int startPos = 0;
        startPos = (page - 1) * rows;
        if (startPos < 0) {
            startPos = 0;
        }
        return startPos;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }
}
