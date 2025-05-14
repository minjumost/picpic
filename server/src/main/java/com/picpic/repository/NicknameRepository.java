package com.picpic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.picpic.entity.Nickname;

@Repository
public interface NicknameRepository extends JpaRepository<Nickname, Long> {
	@Query(value = """
		SELECT
			1 AS nickname_id,
			(SELECT adjective FROM nickname ORDER BY RAND() LIMIT 1) AS adjective,
			(SELECT noun FROM nickname ORDER BY RAND() LIMIT 1) AS noun
		""", nativeQuery = true)
	Nickname findRandom();
}

