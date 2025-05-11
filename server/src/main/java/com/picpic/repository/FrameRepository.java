package com.picpic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.picpic.entity.Frame;

@Repository
public interface FrameRepository extends JpaRepository<Frame, Long> {
}
