package com.sinsaflower.domain.file;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.sinsaflower.domain.user.User;

@Entity
@Table(name = "file")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // id

    @Column(length = 255, nullable = false)
    private String fileName; // file_name

    @Column(length = 255, nullable = false)
    private String fileUrl; // file_url

    @Column(length = 50)
    private String fileType; // file_type

    @Column
    private Long fileSize; // file_size

    @ManyToOne
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy; // uploaded_by

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt; // created_at

    @Column(nullable = false)
    private LocalDateTime updatedAt; // updated_at
} 