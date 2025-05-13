package com.picpic.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.picpic.entity.Stroke;

public interface StrokeRepository extends JpaRepository<Stroke, Long> {
}
