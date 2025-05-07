import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DatabaseLogger {

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.profiles.active:default}")
    private String activeProfile;

    @PostConstruct
    public void logDbConnectionInfo() {
        System.out.println("✅ 현재 활성화된 프로파일: " + activeProfile);
        System.out.println("📡 연결된 DB URL: " + dbUrl);
    }
}
