/**    
 * 文件名：MapColorHolder.java    
 *    
 * 版本信息：    
 * 日期：2015-3-27    
 * Copyright： 北京锐安科技有限公司 2015  版权所有      
 * 作者：  项志坚
 */
package com.bjrun.autodata.component;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import javax.annotation.PostConstruct;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Component;

/**    
 *     
 * 项目名称：rail  
 * 类名称：MapColorHolder   
 * 类描述：  
 * 创建人：项志坚  
 * 创建时间：2015-3-27 下午5:28:56 
 * 修改人：项志坚  
 * 修改时间：2015-3-27 下午5:28:56   
 * 修改备注：
 * @version     
 *     
 */
@Component("mapColorHolder")
public class MapColorHolder {
    private final Log logger = LogFactory.getLog(MapColorHolder.class);

    // 1: #fff000,aaafff
    private Map<Integer, String> colors = new HashMap<Integer, String>();

    @PostConstruct
    private void init() {
        Properties properties = new Properties();
        try {
            InputStream inputStream = this.getClass().getClassLoader()
                    .getResourceAsStream("resources/rail.properties");
            properties.load(inputStream);

            for (int i = 0; i < 10; i++) {
                String color = properties.getProperty("color" + i,
                        "#0033cc,red");
                colors.put(i, color);
            }
        } catch (FileNotFoundException e) {
            logger.error(e);
        } catch (IOException e) {
            logger.error(e);
        }

    }

    public String getColor(Integer idx) {
        if (idx < 0 || idx > 9) {
            return "#0033cc,red";
        }
        return colors.get(idx);

        //        Properties properties = new Properties();
        //        try {
        //            InputStream inputStream = this.getClass().getClassLoader()
        //                    .getResourceAsStream("resources/rail.properties");
        //            properties.load(inputStream);
        //
        //            return properties.getProperty("color" + idx, "#0033cc,red");
        //
        //        } catch (FileNotFoundException e) {
        //            logger.error(e);
        //        } catch (IOException e) {
        //            logger.error(e);
        //        }
        //
        //        return "#0033cc,blue";
    }
}
