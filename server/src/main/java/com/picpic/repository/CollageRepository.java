package com.picpic.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.picpic.entity.Collage;

@Repository
public interface CollageRepository extends JpaRepository<Collage, Long> {
	Optional<Collage> findByCollageId(Long collageId);
}
