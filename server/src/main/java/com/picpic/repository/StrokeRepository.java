package com.picpic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.picpic.entity.Stroke;

@Repository
public interface StrokeRepository extends JpaRepository<Stroke, Long> {
}
