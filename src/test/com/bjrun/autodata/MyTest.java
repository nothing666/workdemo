/**    
 * 文件名：MyTest.java    
 *    
 * 版本信息：    
 * 日期：2015-4-22    
 * Copyright： 北京锐安科技有限公司 2015  版权所有      
 * 作者：  项志坚
 */
package com.bjrun.autodata;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.junit.Test;

/**    
 *     
 * 项目名称：RAIL_V1.02  
 * 类名称：MyTest   
 * 类描述：  
 * 创建人：项志坚  
 * 创建时间：2015-4-22 下午3:01:51 
 * 修改人：项志坚  
 * 修改时间：2015-4-22 下午3:01:51   
 * 修改备注：
 * @version     
 *     
 */
public class MyTest {

    //orcl为oracle数据库中的数据库名，localhost表示连接本机的oracle数据库     
    //1521为连接的端口号     
    private static String url = "jdbc:oracle:thin:@192.168.18.110:1521:orcl";

    //system为登陆oracle数据库的用户名     
    private static String user = "rail";

    //manager为用户名system的密码     
    private static String password = "runbaomi";

    public static Connection conn;

    public static PreparedStatement ps;

    public static ResultSet rs;

    public static Statement st;

    //连接数据库的方法     
    public static Connection getConnection() {
        try {
            //初始化驱动包     
            Class.forName("oracle.jdbc.driver.OracleDriver");
            //根据数据库连接字符，名称，密码给conn赋值     
            return DriverManager.getConnection(url, user, password);

        } catch (Exception e) {
            // TODO: handle exception     
            e.printStackTrace();
        }
        return null;
    }

    public static void query() {

        conn = getConnection(); //同样先要获取连接，即连接到数据库     
        StringBuffer sb = new StringBuffer();
        try {
            String sql = "select distinct t.cityname, t.citypy from T_RUN_RAILSTATION_INFO t order by t.cityname"; // 查询数据的sql语句     
            st = (Statement) conn.createStatement(); //创建用于执行静态sql语句的Statement对象，st属局部变量     

            ResultSet rs = st.executeQuery(sql); //执行sql查询语句，返回查询数据的结果集     
            //System.out.println("最后的查询结果为：");

            while (rs.next()) { // 判断是否还有下一个数据     

                // 根据字段名获取相应的值     
                String name = rs.getString("cityname");
                String py = rs.getString("citypy");

                String pingying = trim(py).toLowerCase();

                String shortPy = shortPy(py);

                //输出查到的记录的各个字段的值     
                String item = name + "|" + pingying + "|" + shortPy;
                sb.append("'").append(item).append("'").append(",");
            }
            conn.close(); //关闭数据库连接     

        } catch (SQLException e) {
            System.out.println("查询数据失败");
        }
        System.out.println(sb.toString());
    }

    public static String trim(String s) {
        return s.replaceAll("(\\u00A0|\\s|\\u3000)*", "");
    }

    public static String shortPy(String s) {
        String[] sArr = s.split("\\s{1,}");
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < sArr.length; i++) {
            sb.append(sArr[i].substring(0, 1).toLowerCase());
        }
        return sb.toString();
    }

    /**
     * Test method for {@link com.bjrun.rail.component.ConfigFileReader#readConfigFile(java.lang.String)}.
     */
    @Test
    public void testQuery() {
        //System.out.println(shortPy("En  Tu Jia Zu Miao Zu Zi Zhi Zhou"));
        query();
    }
}
