/**    
 * 文件名：ConfigFileReader.java    
 *    
 * 版本信息：    
 * 日期：2015-4-23    
 * Copyright： 北京锐安科技有限公司 2015  版权所有      
 * 作者：  项志坚
 */
package com.bjrun.autodata.component;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Component;

/**    
 *     
 * 项目名称：RAIL_V1.02  
 * 类名称：ConfigFileReader   
 * 类描述：  读取系统配置文件
 * 创建人：项志坚 
 * 创建时间：2015-4-23 下午2:43:13 
 * 修改人：项志坚   
 * 修改时间：2015-4-23 下午2:43:13   
 * 修改备注：
 * @version     
 *     
 */
@Component("configFileReader")
public class ConfigFileReader {
    private final Log logger = LogFactory.getLog(ConfigFileReader.class);

    private Map<String, String> fileContentMap = new HashMap<String, String>();

    /**
     * readConfigFile(读取指定配置文件)       
     *@param fileName 存放在resources目录下的配置文件
     *@return 文件内容以String返回
     */
    public synchronized String readConfigFile(String fileName) {

        String fileContent = fileContentMap.get(fileName);
        if (fileContent == null) {

            String resFile = "resources/" + fileName;
            InputStream inputStream = null;
            BufferedReader in = null;
            try {
                inputStream = this.getClass().getClassLoader()
                        .getResourceAsStream(resFile);

                StringBuffer sb = new StringBuffer();
                in = new BufferedReader(new InputStreamReader(inputStream,
                        "UTF-8"));

                String line = "";
                while ((line = in.readLine()) != null) {
                    sb.append(line);
                }

                fileContent = sb.toString();
                fileContentMap.put(fileName, fileContent);
            } catch (FileNotFoundException e) {
                logger.error(e);
            } catch (IOException e) {
                logger.error(e);
            } finally {
                try {
                    if (in != null) {
                        in.close();
                    }
                    if (inputStream != null) {
                        inputStream.close();
                    }
                } catch (IOException e) {
                    logger.error(e);
                }
            }
        }
        return fileContent;
    }
}
