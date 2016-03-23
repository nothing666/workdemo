/**    
 * 文件名：ConfigFileReaderTest.java    
 *    
 * 版本信息：    
 * 日期：2015-4-23    
 * Copyright： 北京锐安科技有限公司 2015  版权所有      
 * 作者：  项志坚
 */
package com.bjrun.autodata.component;

import javax.annotation.Resource;

import org.junit.Test;

import com.bjrun.autodata.SpringTestBase;
import com.bjrun.autodata.component.ConfigFileReader;

/**    
 *     
 * 项目名称：RAIL_V1.02  
 * 类名称：ConfigFileReaderTest   
 * 类描述：  
 * 创建人：项志坚  
 * 创建时间：2015-4-23 下午3:42:20 
 * 修改人：项志坚  
 * 修改时间：2015-4-23 下午3:42:20   
 * 修改备注：
 * @version     
 *     
 */
public class ConfigFileReaderTest extends SpringTestBase {

    @Resource(name = "configFileReader")
    private ConfigFileReader fileReader;

    /**
     * Test method for {@link com.bjrun.rail.component.ConfigFileReader#readConfigFile(java.lang.String)}.
     */
    @Test
    public void testReadConfigFile() {
        System.out.println(fileReader.readConfigFile("containerKp.txt"));
    }

}
