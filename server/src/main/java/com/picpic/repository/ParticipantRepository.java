package com.picpic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.picpic.entity.Participant;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Long> {
}
