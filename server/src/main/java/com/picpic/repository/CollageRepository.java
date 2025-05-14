package com.picpic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.picpic.entity.Collage;

@Repository
public interface CollageRepository extends JpaRepository<Collage, Long> {
}
