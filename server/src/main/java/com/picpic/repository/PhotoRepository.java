package com.picpic.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.picpic.entity.Photo;

import software.amazon.awssdk.services.s3.model.ObjectPart;

public interface PhotoRepository extends JpaRepository<Photo, Long> {
	Optional<Photo> findBySessionIdAndSlotIndex(Long sessionId, Integer slotIndex);
}
