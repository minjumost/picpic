package com.picpic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.picpic.entity.Member;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
}
