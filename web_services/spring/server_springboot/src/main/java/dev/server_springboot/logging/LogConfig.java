package dev.server_springboot.logging;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.AbstractRequestLoggingFilter;
import jakarta.servlet.http.HttpServletRequest;

class CustomRequestLoggingFilter extends AbstractRequestLoggingFilter { //Works with using parent of CommonsRequestLoggingFilter which we mean to replace

    public CustomRequestLoggingFilter() {
      super.setIncludeQueryString(true);
      super.setIncludePayload(true);
      super.setMaxPayloadLength(10000);
      super.setIncludeHeaders(true);
      super.setBeforeMessagePrefix("Initial Request:\n...................\n");
      super.setAfterMessagePrefix("Request Body:\n...................\n");
    }
    @Override
    protected void beforeRequest(HttpServletRequest httpServletRequest, String message) {
        this.logger.debug(message);
        System.out.println(String.format("\n%s\n",message));
    }

    @Override
    protected void afterRequest(HttpServletRequest httpServletRequest, String message) {
        System.out.println(String.format("\n%s\n",message));
    }
}



@Configuration
public class LogConfig {

    @Bean
    public CustomRequestLoggingFilter logFilter() {
        System.out.println("...........................................................................................");
        CustomRequestLoggingFilter filter= new CustomRequestLoggingFilter();
        return filter;
    }
}
