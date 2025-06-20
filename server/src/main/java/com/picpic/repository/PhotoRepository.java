package com.picpic.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.picpic.entity.Photo;
import com.picpic.entity.Session;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {
	Optional<Photo> findBySessionAndSlotIndex(Session session, Integer slotIndex);

	Optional<Photo> findByphotoId(Long photoId);

	List<Photo> findAllBySession(Session session);

	Boolean existsBySessionAndSlotIndex(Session session, Integer slotIndex);

	List<Photo> findManyBySession(Session session);
}
