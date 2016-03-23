/**    
 * 文件名：StringUtils.java    
 *    
 * 版本信息：    
 * 日期：2015-3-31    
 * Copyright： 北京锐安科技有限公司 2015  版权所有      
 * 作者：  项志坚
 */
package com.bjrun.autodata.utils.common;

/**    
 *     
 * 项目名称：rail  
 * 类名称：StringUtils   
 * 类描述：  
 * 创建人：项志坚  
 * 创建时间：2015-3-31 下午6:16:32 
 * 修改人：项志坚  
 * 修改时间：2015-3-31 下午6:16:32   
 * 修改备注：
 * @version     
 *     
 */
public class StringUtils {
    public static boolean isNullOrEmpty(String s) {
        if (s == null || "".equals(s.trim())) {
            return true;
        }

        return false;
    }
}
