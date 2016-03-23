/**    
 * 文件名：SpringTestBase.java    
 *    
 * 版本信息：    
 * 日期：2015-2-3    
 * Copyright： 北京锐安科技有限公司 2015  版权所有      
 * 作者：  项志坚
 */
package com.bjrun.autodata;

import org.apache.log4j.PropertyConfigurator;
import org.junit.runner.RunWith;
import org.springframework.stereotype.Service;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**    
 *     
 * 项目名称：rail  
 * 类名称：SpringTestBase   
 * 类描述：  
 * 创建人：项志坚 
 * 创建时间：2015-2-3 下午1:44:10 
 * 修改人：项志坚   
 * 修改时间：2015-2-3 下午1:44:10   
 * 修改备注：
 * @version     
 *     
 */
@Service
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations =
{ "classpath:/resources/spring/*.xml" })
public class SpringTestBase
{
    public SpringTestBase()
    {
        PropertyConfigurator.configure("log4j.properties"); //Second step
    }
}