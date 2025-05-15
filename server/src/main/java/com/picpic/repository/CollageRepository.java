package com.picpic.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.picpic.entity.Collage;
import com.picpic.entity.Session;

@Repository
public interface CollageRepository extends JpaRepository<Collage, Long> {
	Optional<Collage> findByCollageId(Long collageId);

	Optional<Collage> findBySession(Session session);
}
