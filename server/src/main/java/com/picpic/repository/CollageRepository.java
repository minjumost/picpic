package com.picpic.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.picpic.entity.Collage;

public interface CollageRepository extends JpaRepository<Collage, Long> {
}
