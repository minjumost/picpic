package com.picpic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.picpic.entity.Background;

@Repository
public interface BackgroundRepository extends JpaRepository<Background, Long> {
}
