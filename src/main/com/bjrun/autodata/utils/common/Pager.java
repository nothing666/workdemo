package com.bjrun.autodata.utils.common;

import java.util.List;

public class Pager {

    private int total;

    private int page;

    /**    
     * page    
     *    
     * @return  the page       
    */

    public int getPage() {
        return page;
    }

    /**    
     * @param page the page to set    
     */
    public void setPage(int page) {
        this.page = page;
    }

    private List<?> rows;

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public List<?> getRows() {
        return rows;
    }

    public void setRows(List<?> rows) {
        this.rows = rows;
    }
}
