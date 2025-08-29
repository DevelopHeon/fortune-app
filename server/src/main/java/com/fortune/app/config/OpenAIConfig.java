package com.fortune.app.config;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.retry.annotation.EnableRetry;

/**
 * OpenAI ChatModel 설정
 */
@Configuration
@EnableRetry
public class OpenAIConfig {

    @Value("${spring.ai.openai.api-key}")
    private String openAiApiKey;
    
    @Value("${spring.ai.openai.chat.options.model:gpt-3.5-turbo}")
    private String model;
    
    @Value("${spring.ai.openai.chat.options.max-tokens:2000}")
    private Integer maxTokens;
    
    @Value("${spring.ai.openai.chat.options.temperature:0.7}")
    private Double temperature;

    @Bean
    public OpenAiApi openAiApi() {
        return new OpenAiApi(openAiApiKey);
    }

    @Bean
    public ChatModel chatModel(OpenAiApi openAiApi) {
        OpenAiChatOptions options = OpenAiChatOptions.builder()
                .withModel(model)
                .withMaxTokens(maxTokens)
                .withTemperature(temperature)
                .build();
                
        return new OpenAiChatModel(openAiApi, options);
    }
}