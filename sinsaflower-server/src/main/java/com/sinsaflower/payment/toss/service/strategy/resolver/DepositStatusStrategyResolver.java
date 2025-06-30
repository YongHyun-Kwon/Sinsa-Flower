package com.sinsaflower.payment.toss.service.strategy.resolver;

import com.sinsaflower.payment.toss.domain.VirtualAccount;
import com.sinsaflower.payment.toss.dto.TossDepositCallbackWebhookDto;
import com.sinsaflower.payment.toss.service.strategy.implement.DepositStatusStrategy;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
@Slf4j
@RequiredArgsConstructor
public class DepositStatusStrategyResolver {

//    private final Map<String, DepositStatusStrategy> strategies;
//
//    public DepositStatusStrategyResolver(List<DepositStatusStrategy> strategyList) {
//        this.strategies = strategyList.stream().collect(Collectors.toMap(
//                s -> s.getClass().getAnnotation(Component.class).value(),
//                Function.identity()
//        ));
//    }

    private final List<DepositStatusStrategy> strategyList;
    private final Map<String, DepositStatusStrategy> strategies = new HashMap<>();

    @PostConstruct
    public void init() {
        for (DepositStatusStrategy strategy : strategyList) {
            String key = strategy.getKey();
            if (strategies.containsKey(key)) {
                throw new IllegalStateException("Duplicate strategy key: " + key);
            }
            strategies.put(key, strategy);
        }
    }

    public DepositStatusStrategy resolve(String status) {
        return strategies.getOrDefault(status, new DepositStatusStrategy() {
            @Override
            public String getKey() {
                return "NO_OP";
            }

            @Override
            public void handle(TossDepositCallbackWebhookDto dto, VirtualAccount account) {
                log.warn("No strategy found for status: {}", status);
            }
        });
    }
}
