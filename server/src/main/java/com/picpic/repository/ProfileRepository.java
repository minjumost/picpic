package com.picpic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.picpic.entity.Profile;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Integer> {
	@Query(value = "SELECT * FROM profile ORDER BY RAND() LIMIT 1", nativeQuery = true)
	Profile findRandom();
}
